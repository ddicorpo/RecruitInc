/**
 * Typegoose is including schema and model in one class
 */
import { Typegoose } from 'typegoose';
import { IGitModel } from '../../domain/model/IGitModel';

export class GitSchema extends Typegoose implements IGitModel {
  //TODO: Add Field
}
