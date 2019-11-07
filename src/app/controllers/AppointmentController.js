import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
// import pt from 'date-fns/locale/pt'; // use this if you want to change locale
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

// import Mail from '../../lib/Mail';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmetController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * Check if provider isn't himself
     */
    if (req.body.provider_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't make an appointment with yourself" });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ erro: 'Past dates are not allowed' });
    }

    /**
     * Check date availability
     */
    const checkAvailabily = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
        // { locale: pt } use this if you want to change locale
      },
    });

    if (checkAvailabily) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Nofify appointment provider
     */

    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "MMMM' the 'd'th at 'H:mm'h'");

    await Notification.create({
      content: `New appointment from ${user.name}, ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    /**
     * Verify if user is the same who made the appointment
     */
    if (appointment.user_id !== req.userId) {
      return res.status(491).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    /**
     * Verify if it is at least 2 hours before appointment
     */
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    // await Mail.sendMail({
    //   to: `${appointment.provider.name} <${appointment.provider.email}>`,
    //   subject: 'Appointment cancelled',
    //   template: 'cancellation',
    //   context: {
    //     provider: appointment.provider.name,
    //     user: appointment.user.name,
    //     date: format(appointment.date, "MMMM' the 'd'th at 'H:mm'h'"),
    //   },
    // });

    return res.json(appointment);
  }
}

export default new AppointmetController();
