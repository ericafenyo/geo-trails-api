import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .addBearerAuth()
    .setVersion("1.0.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    Logger.log(`Listening on port ${port}`, "NestApplication");
  });
}

bootstrap();
