import { type SessionRecord } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { filter, Subject } from "rxjs";

export class SessionEvents {
  private readonly revoked = new Subject<SessionRecord["id"]>();

  revoke(session: SessionRecord) {
    this.revoked.next(session.id);
  }

  onRevoked(session: SessionRecord) {
    return this.revoked
      .asObservable()
      .pipe(filter((sessionId) => sessionId === session.id));
  }
}

@Module({
  providers: [SessionEvents],
  exports: [SessionEvents],
})
export class SessionEventsModule {}
