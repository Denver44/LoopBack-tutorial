import {
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import {
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationOptions,
  AuthorizationTags,
} from '@loopback/authorization';
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
import {MySequence} from './sequence';
import {DbDataSource} from './datasources';

import {
  DsmAuthenticationComponent,
  RefreshTokenServiceBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from './extensions/authentication';

import {MyAuthorizationProvider} from './services/my-authorizer-provider.service';

export {ApplicationConfig};

export class MessaegeBOXApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

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
    this.configure(AuthenticationBindings.COMPONENT).to({
      defaultMetadata: {strategy: 'ai-auth-strategy'},
    });

    this.component(AuthenticationComponent);

    // JWT Component Loaded And bind custom Configuration START
    this.component(DsmAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to('dsmJWTToken');
    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
      'dsmRefreshJWTToken',
    );

    // for jwt access token expiration
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('216000');
    // for refresh token expiration
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to('216000');
    // JWT Component Loaded And bind custom Configuration END

    // Load Authorization Component START
    const authorizationOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    const binding = this.component(AuthorizationComponent);
    this.configure(binding.key).to(authorizationOptions);

    this.bind('authorizationProviders.my-authorizer-provider')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);
  }
}
