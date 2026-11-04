import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class extends SessionCookieProvider<{}> {
  constructor(authenticationRegistry: AuthenticationRegistry) {
    super();

    authenticationRegistry.registerProvider(this);
  }

  validate(sessionRecord: SessionRecord) {
    return {
      id: Math.random().toString(),
    };
  }
}
