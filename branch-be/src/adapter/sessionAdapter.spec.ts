import sinon from "sinon";
import chai from "chai";
import sessionAdapter from "./sessionAdapter";
import usersDAO from "../dao/usersDAO";
import admin from "../utils/firebase";
import { WhereOptions } from "sequelize";
import { UserAttributes, UserInstance } from "../types";
import { SessionCookieOptions } from "firebase-admin/lib/auth/base-auth";

const { expect } = chai;

describe("session adapter testing", () => {
  describe("createSession", ()=> {

    let findOneByFilterStub: sinon.SinonStub<[filter: WhereOptions<UserAttributes>], Promise<UserInstance | null>>;
    let createSessionStub: sinon.SinonStub<[idToken: string, sessionCookieOptions: SessionCookieOptions], Promise<string>>;

    beforeEach(()=> {
      findOneByFilterStub = sinon.stub(usersDAO, "findOneByFilter");
      createSessionStub = sinon.stub(admin.auth(), "createSessionCookie");
    });

    afterEach(() => {
      sinon.restore();
    });
        
    it("should throw an error if idToken is missing", async () => {
      // Arrange
      const uid = "someUid";
        
      // Act and Assert
      await expect(sessionAdapter.createSession(undefined as any, uid)).to.be.rejectedWith("The IdToken is required to start the session");
      expect(findOneByFilterStub.notCalled).to.be.true;
      expect(createSessionStub.notCalled).to.be.true;
    });
        
    it("should throw an error if uid is missing", async () => {
      // Arrange
      const idToken = "someIdToken";
        
      // Act and Assert
      await expect(sessionAdapter.createSession(idToken, undefined as any)).to.be.rejectedWith("The user uid is required to start the session");
      expect(findOneByFilterStub.notCalled).to.be.true;
      expect(createSessionStub.notCalled).to.be.true;
    });
        
    it("should call admin.auth().createSessionCookie with correct arguments", async () => {
      // Arrange
      const idToken = "someIdToken";
      const uid = "someUid";
      const expiresIn = 1000;
        
      createSessionStub.resolves("sessionCookie");
      findOneByFilterStub.resolves({ uid } as UserInstance);
        
      // Act
      await sessionAdapter.createSession(idToken, uid, expiresIn);
        
      // Assert
      expect(createSessionStub.calledOnceWith(idToken, { expiresIn })).to.be.true;
    });
        
    it("should call usersDAO.findOneByFilter with correct argument", async () => {
      // Arrange
      const idToken = "someIdToken";
      const uid = "someUid";
      const expiresIn = 1000;
        
      createSessionStub.resolves("sessionCookie");
      findOneByFilterStub.resolves({ uid } as UserInstance);
        
      // Act
      await sessionAdapter.createSession(idToken, uid, expiresIn);
        
      // Assert
      expect(findOneByFilterStub.calledOnceWith({ uid })).to.be.true;
    });
        
    it("should return session and user", async () => {
      // Arrange
      const idToken = "someIdToken";
      const uid = "someUid";
      const expiresIn = 1000;
        
      createSessionStub.resolves("sessionCookie");
      findOneByFilterStub.resolves({ uid } as UserInstance);
        
      // Act
      const result = await sessionAdapter.createSession(idToken, uid, expiresIn);
        
      // Assert
      expect(result).to.deep.equal({ session: "sessionCookie", user: { uid } });
    });

    it("should throw error when an error occurs creating cookie session", async ()=> {
      // Arrange
      const idToken = "someIdToken";
      const uid = "someUid";
      const expiresIn = 1000;
        
      createSessionStub.rejects(new Error("Error creating cookie session"));
      findOneByFilterStub.resolves({ uid } as UserInstance);
        
      // Act
      await expect(sessionAdapter.createSession(idToken, uid, expiresIn)).to.eventually.rejectedWith("Error creating cookie session");
        
      // Assert
      expect(findOneByFilterStub.calledOnceWith({ uid })).to.be.true;
      expect(createSessionStub.calledOnceWith(idToken, { expiresIn })).to.be.true;
    });

    it("should throw error when an error occurs searching user by uid", async ()=> {
      // Arrange
      const idToken = "someIdToken";
      const uid = "someUid";
      const expiresIn = 1000;
          
      createSessionStub.resolves("sessionCookie");
      findOneByFilterStub.rejects(new Error("Error searching user"));
          
      // Act
      await expect(sessionAdapter.createSession(idToken, uid, expiresIn)).to.eventually.rejectedWith("Error searching user");
          
      // Assert
      expect(findOneByFilterStub.calledOnceWith({ uid })).to.be.true;
      expect(createSessionStub.calledOnceWith(idToken, { expiresIn })).to.be.true;
    });
  });

  
});
