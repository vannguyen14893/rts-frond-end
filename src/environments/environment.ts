// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // Production server
  // baseUrl: 'http://rts.cmcglobal.com.vn/CMC_Recruitment-0.0.1-SNAPSHOT',
  // Dev server
  // baseUrl: 'http://101.99.14.196:8480/CMC_Recruitment-0.0.1-SNAPSHOT',
  baseUrl: 'http://localhost:8082/api',
  // baseUrl: 'http://192.168.10.149:8082/api',
};

