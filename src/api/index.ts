import { role } from "./roles";
import { permission } from "./permession";
import { user } from "./users";
import { auth } from "./auth";
import { entreprise } from "./entreprise";
import { task } from "./task";

import { employee } from "./employee";
import { content } from "./content";
import { project } from "./project";
import { dashboard } from "./dashboard";

export const api = {
  auth,
  permission,
  role,
  user,
  entreprise,
  employee,
  ...content,
  task,
  project,
  dashboard,
};
