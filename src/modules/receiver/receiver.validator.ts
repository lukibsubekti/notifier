import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isEmpty,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EmailMethod } from './receiver.dto';

@ValidatorConstraint({ name: 'ValidTemplateConstraint', async: false })
export class ValidTemplateConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const method = args.object['method'] as EmailMethod;
        const brevoTemplate = args.object['brevo_template'];

        if (isEmpty(value)) {
          if (method !== EmailMethod.BREVO) {
            return false;
          }
          if (method === EmailMethod.BREVO && isEmpty(brevoTemplate)) {
            return false;
          }
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `$property cannot be empty if the method is not "brevo" or if the method is "brevo" but "brevo_template" is empty`;
    }
}

export function ValidTemplate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: ['method','brevo_template'],
            validator: ValidTemplateConstraint,
        });
    };
}

/**
 * Transform a value into allowed value
 * eg. used to get valid "orderBy" in query parameter
 */
export const ToValidOption = (options: any[], defaultValue: any) =>
  Transform((source) => {
    if (!options.includes(source.value)) {
      return defaultValue;
    }
    return source.value;
  });
