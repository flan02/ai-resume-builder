import { EditorFormProps } from "@/lib/types";
import EducationForm from "./forms/EducationForm";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

type FormItemProps = { title: string, component: React.ComponentType<EditorFormProps>, key: string }

export const steps: FormItemProps[] = [
  { title: "Informacion General", component: GeneralInfoForm, key: "general-info" },
  { title: "Informacion Personal", component: PersonalInfoForm, key: "personal-info" },
  { title: "Experiencia Laboral", component: WorkExperienceForm, key: "work-experience" },
  { title: "Educacion", component: EducationForm, key: "education" },
  { title: "Habilidades", component: SkillsForm, key: "skills" },
  { title: "Sumario", component: SummaryForm, key: "summary" }
];