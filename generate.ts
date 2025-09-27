import {
    generateRoutes,
    generateSpec,
    ExtendedRoutesConfig,
    ExtendedSpecConfig,
  } from "tsoa";
  
  (async () => {
    const specOptions: ExtendedSpecConfig = {
      basePath: "/src",
      entryFile: "./src/server.ts",
      specVersion: 3,
      outputDirectory: "./build",
      controllerPathGlobs: ["./src/**/*Controller.ts"],
      noImplicitAdditionalProperties: "throw-on-extras",
    };
  
    const routeOptions: ExtendedRoutesConfig = {
      basePath: "/src",
      entryFile: "./src/server.ts",
      routesDir: "./src",
      noImplicitAdditionalProperties: "throw-on-extras",
      bodyCoercion: true,
    };
  
    await generateSpec(specOptions);
  
    await generateRoutes(routeOptions);
  })();