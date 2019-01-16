import { ApplicantSchema } from './applicantSchema';
import { prop, Ref, Typegoose } from 'typegoose';
import { mongoose } from 'mongoose';
import { Model, Schema } from 'mongoose';
import { IGithubProjectInput } from "../../matching-algo/data-model/input-model/IGithubProjectInput";
import { iCommitSchema } from "./iCommitSchema";
import { iProjectStructureSchema } from "./iProjectStructureSchema";
import { iSourceFilesSchema } from "./iSourceFilesSchema";


export class iGithubProjectInputSchema extends Typegoose implements IGithubProjectInput{
    @prop()
    _id?: mongoose.Types.ObjectId;

    @prop()
    owner: string;

    @prop()
    projectName: string;

    @prop({ ref: iCommitSchema })
    applicantCommits: Ref<iCommitSchema[]>;

    @prop({ ref: iProjectStructureSchema })
    projectStructure: Ref<iProjectStructureSchema[]>;

    @prop({ ref: iSourceFilesSchema })
    downloadedSourceFile: Ref<iSourceFilesSchema[]>;

}

export const iGithubProjectInputModel: Model<IGithubProjectInput> = ApplicantSchema.getModel(iGithubProjectInputSchema, 'iGithubProjectInput');