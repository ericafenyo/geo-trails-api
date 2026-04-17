import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ProblemDetailFilter } from "./filters/problem-detail.filter";

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();
  app.useGlobalFilters(new ProblemDetailFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .addBearerAuth()
    .setVersion("1.0.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);

  const port = process.env.PORT || 3000;

  await app.listen(port, async () => {
    const url = await app.getUrl();
    Logger.log(url, "NestApplication");
  });
}

bootstrap();
