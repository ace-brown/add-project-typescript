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
  let isVlaid;

  if (validateInput.required) {
    isVlaid = isVlaid && validateInput.value.toString().trim().length !== 0;
  }

  if (validateInput.minLength && typeof validateInput.value === "string") {
    isVlaid = isVlaid && validateInput.value.length > validateInput.minLength;
  }
}

class ProjectInput {
  // Types
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Inputs
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedFormNode = document.importNode(
      this.templateElement.content,
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

    if (
      validate({ value: enteredTitle, required: true, minLength: 5 }) &&
      validate({ value: enteredDescription, required: true, minLength: 5 }) &&
      validate({ value: enteredPeople, required: true, minLength: 5 })
    ) {
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
    }
    this.clearInput();
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
