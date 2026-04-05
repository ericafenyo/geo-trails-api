import { Controller, Get } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  message(): any {
    return {
      message: "Welcome! use '/swagger' endpoint to access the API documentation.",
    };
  }
}
