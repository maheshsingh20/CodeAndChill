import mongoose, { Schema, Document } from "mongoose";

export interface IGeneralTopic {
  title: string;
  contentType: "video" | "text" | "table";
  videoUrl?: string;
  textContent?: string;
  tableData?: string[][];
}

export interface IGeneralLesson {
  title: string;
  topics: IGeneralTopic[];
}

export interface IGeneralModule {
  title: string;
  lessons: IGeneralLesson[];
}

export interface IGeneralCourse extends Document {
  title: string;
  slug: string;
  description: string;
  tutor: {
    name: string;
    image: string;
  };
  cost: number;
  modules: IGeneralModule[];
}

const GeneralTopicSchema = new Schema<IGeneralTopic>({
  title: { type: String, required: true },
  contentType: { type: String, enum: ["video", "text", "table"], required: true },
  videoUrl: String,
  textContent: String,
  tableData: [[String]],
});

const GeneralLessonSchema = new Schema<IGeneralLesson>({
  title: { type: String, required: true },
  topics: [GeneralTopicSchema],
});

const GeneralModuleSchema = new Schema<IGeneralModule>({
  title: { type: String, required: true },
  lessons: [GeneralLessonSchema],
});

const GeneralCourseSchema = new Schema<IGeneralCourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tutor: { name: String, image: String },
  cost: { type: Number, required: true },
  modules: [GeneralModuleSchema],
});

export const GeneralCourse = mongoose.models.GenralCourse || mongoose.model("GenralCourse", GeneralCourseSchema);