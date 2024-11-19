import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { AuthorizationComponent } from '@loopback/authorization';
import { AuthenticationBindings, AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { BasicStrategy } from './authorisation/authentication';

export { ApplicationConfig };
  


export class ItAssetManagementApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //setup authorization - SAAM
    this.component(AuthorizationComponent);
    this.component(AuthenticationComponent);

    // Register the Basic Authentication strategy  
    registerAuthenticationStrategy(this, BasicStrategy);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
