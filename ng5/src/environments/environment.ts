// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  urls: {
    //Products
    GET_PRODUCTS: '/api/products/get',
    POST_SAVE_PRODUCT: '/api/products/save',
    DELETE_PRODUCT: '/api/products/delete',

    GET_CARS: 'api/cars'
  }
};
