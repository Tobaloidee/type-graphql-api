// Imports
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

// Entity
import { User } from "../../../entity/User";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  public validate(email: string) {
    return User.findOne({ where: { email } }).then(user => {
      if (user) {
        return false;
      }
      return true;
    });
  }
}

export const IsEmailAlreadyExist = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsEmailAlreadyExistConstraint
    });
  };
};
