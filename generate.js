import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import pluralize from 'pluralize';
import { PropType } from './DataTypes.js';
import { registerHandlebarsHelpers } from './HandlebarsExtension.js';



registerHandlebarsHelpers();


const settings = {
  modelName: "Example",
  modelNameSnakeCase: "example",
  modelNameCamelCase: "example",
  sameUpdateCreateRequestFile: true,

  props: [
    { name: "name", type: PropType.string.description, isRequired: true },
    { name: "father_name", type: PropType.string.description },
    { name: "mother_name", type: PropType.string.description, isRequired: true },
    { name: "birth_date", type: PropType.date.description },
    { name: "avatar", type: PropType.file.description, isRequired: true },
    { name: "description", type: PropType.string.description },
  ],
  createRules: [
    { name: "name", rule: ["required"] },
    { name: "father_name", rule: ["nullable"] },
    { name: "mother_name", rule: ["required"] },
    { name: "birth_date", rule: ["nullable", "date"] },
    { name: "avatar", rule: ["file", "required"], isUploadedFile: true },

  ],
  updateRules: [
    { name: "title", rule: ["required"] },
    { name: "description", rule: ["nullable"] },
    { name: "avatar", rule: ["file", "nullable"], isUploadedFile: true },
  ],

  createForm: [],
  updateForm: [],
};
settings.pluralModelName = pluralize(settings.modelName, 20);


settings.createForm = settings.props.filter((prop) =>
  settings.createRules.map((rule) => rule.name).includes(prop.name)
);
console.log(settings.updateForm);

if (settings.sameUpdateCreateRequestFile) {
  settings.updateForm = settings.props.filter((prop) =>
    settings.createRules.map((rule) => rule.name).includes(prop.name)
  );
} else {
  settings.updateForm = settings.props.filter((prop) =>
    settings.updateRules.map((rule) => rule.name).includes(prop.name)
  );
}

const templatesDir = "./templates";
const outputDir = "./output";

// Load and compile template
const loadTemplate = (templateName) => {
  const filePath = path.join(templatesDir, templateName);
  const source = fs.readFileSync(filePath, "utf-8");
  return Handlebars.compile(source);
};

// Generate file from template
const generateFile = (templateName, outputFileName, data, output = ".") => {
  const template = loadTemplate(templateName);
  const content = template(data);
  var dir = outputDir + "/" + output;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(
    path.join(dir, outputFileName),
    content
  );
};



// Generate files
const generateFiles = () => {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }



  // Generate Model [DONE]
  generateFile(
    "modelTemplate.php.stub",
    `${settings.modelName}.php`,
    settings,
    "laravel"
  );

  // Generate Request
  if (settings.sameUpdateCreateRequestFile) {
    generateFile(
      "requestTemplate.php",
      `CreateUpdate${settings.modelName}Request.php`,
      {
        requestName: `CreateUpdate${settings.modelName}Request`,
        rules: settings.createRules,
      },
      "laravel"
    );
    generateFile(
      "Form.vue.stub",
      `CreateUpdateForm.vue`,
      {
        form: settings.createForm,
      },
      settings.pluralModelName
    );
  } else {
    generateFile(
      "requestTemplate.php",
      `Create${settings.modelName}Request.php`,
      {
        requestName: `Create${settings.modelName}Request`,
        rules: settings.createRules,
      },
      "laravel"
    );

    generateFile(
      "requestTemplate.php",
      `Update${settings.modelName}Request.php`,
      {
        requestName: `Update${settings.modelName}Request`,
        rules: settings.updateRules,
      },
      "laravel"
    );

    generateFile(
      "Form.vue.stub",
      `CreateFrom.vue`,
      {
        form: settings.createForm,
      },
      settings.pluralModelName
    );

    generateFile(
      "Form.vue.stub",
      `UpdateFrom.vue`,
      {
        form: settings.updateForm,
      },
      settings.pluralModelName
    );
  }

  // Generate Update Request
  // generateFile(
  //   "requestTemplate.php",
  //   `Update${settings.modelName}Request.php`,
  //   {
  //     requestName: `Update${settings.modelName}Request`,
  //     rules: settings.updateRules,
  //   }
  // );

  // Generate Vue CRUD Page

  generateFile(
    "crudTemplate.vue.stub",
    `index.vue`,
    settings,
    settings.pluralModelName
  );
  generateFile("core.ts.stub", `core.ts`, settings, settings.pluralModelName);
  generateFile("migration.php.stub", `migration.php`, settings, 'laravel');


  generateFile(
    "inertia-controller.php.stub",
    `${settings.modelName}InertiaController.php`,
    settings,
    "laravel"
  );

};

generateFiles();
