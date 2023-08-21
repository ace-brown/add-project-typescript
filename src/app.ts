// Project State management - store project data and push them to ProjectList class to display them
class ProjectState {
  private static instance: ProjectState;
  private projects: any[] = [];
  private listeners: any[] = [];

  private constructor() {}

  static getInstane() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listnerFunc: Function) {
    this.listeners.push(listnerFunc);
  }

  addProject(title: string, desc: string, NumOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: desc,
      people: NumOfPeople,
    };
    this.projects.push(newProject);
  }
}

const projectState = ProjectState.getInstane();
// Input Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateInput: Validatable) {
  let isVlaid = true;

  if (validateInput.required) {
    isVlaid = isVlaid && validateInput.value.toString().trim().length !== 0;
  }

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isVlaid = isVlaid && validateInput.value.length > validateInput.minLength;
  }

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
    isVlaid = isVlaid && validateInput.value.length < validateInput.maxLength;
  }

  if (validateInput.min != null && typeof validateInput.value === "number") {
    isVlaid = isVlaid && validateInput.value > validateInput.min;
  }

  if (validateInput.max != null && typeof validateInput.value === "number") {
    isVlaid = isVlaid && validateInput.value < validateInput.max;
  }

  return isVlaid;
}

// ProjectList class - responsible for outputing projects on the webpage
class ProjectList {
  projectListTemplateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  projectElement: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.projectListTemplateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedFormNode = document.importNode(
      this.projectListTemplateElement.content,
      true
    );
    this.projectElement = importedFormNode.firstElementChild as HTMLElement;
    this.projectElement.id = `${this.type}-projects`;

    // Function call
    this.attach();
    this.renderContent();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.projectElement);
  }

  private renderContent() {
    // Setting #(aka id) for ul element
    const listId = `${this.type}-project-list`;
    this.projectElement.querySelector("ul")!.id = listId;
    this.projectElement.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECT";
  }
}

// ProjectInput class - show the input field on the page and passing user data to state management class
class ProjectInput {
  // Types
  inputTemplateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Inputs
    this.inputTemplateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedFormNode = document.importNode(
      this.inputTemplateElement.content,
      true
    );
    this.formElement = importedFormNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    // Function calls
    this.attach();
    this.configure();
  }

  // Functions

  private gatherUserInformation(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleObj: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 5,
    };

    const descObj: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleObj: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (!validate(titleObj) || !validate(descObj) || !validate(peopleObj)) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private configure() {
    this.formElement.addEventListener(
      "submit",
      this.formSubmitHandler.bind(this)
    );
  }

  private formSubmitHandler(event: Event) {
    event.preventDefault();
    const userInfo = this.gatherUserInformation();
    if (Array.isArray(userInfo)) {
      const [title, desc, people] = userInfo;
      // passing user data to state management class
      projectState.addProject(title, desc, people);
      this.clearInput();
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const projectInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
