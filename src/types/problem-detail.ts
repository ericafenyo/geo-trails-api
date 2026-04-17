export class ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;

  constructor(params: { type: string; title: string; status: number; detail?: string }) {
    this.type = params.type;
    this.title = params.title;
    this.status = params.status;
    this.detail = params.detail;
  }
}
