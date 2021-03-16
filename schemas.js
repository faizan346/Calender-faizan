const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.taskSchema = Joi.object({
        task: Joi.string().required().escapeHTML(),
        time: Joi.object({
            year: Joi.string().required().escapeHTML(),
            month: Joi.string().required().escapeHTML(),
            date: Joi.string().required().escapeHTML(),
            hour: Joi.string().required().escapeHTML(),
            minute: Joi.string().required().escapeHTML(),
        }).required(),
        status: Joi.boolean().required()
})
