import {
  createRoleService,
  getRolesService,
  getRoleByIdService,
  isRoleAllowed,
} from "../../../src/services/roles.service";
import * as repo from "../../../src/repositories/roles.repository";

jest.mock("../../../src/repositories/roles.repository");

describe("roles.service - Unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("isRoleAllowed - returns true for 'admin' and 'personal' (case insensitive)", () => {
    expect(isRoleAllowed("admin")).toBe(true);
    expect(isRoleAllowed("ADMIN")).toBe(true);
    expect(isRoleAllowed("personal")).toBe(true);
    expect(isRoleAllowed("Personal")).toBe(true);
  });

  it("isRoleAllowed - returns false for invalid values", () => {
    expect(isRoleAllowed("")).toBe(false);
    expect(isRoleAllowed("random")).toBe(false);
    expect(isRoleAllowed(null as any)).toBe(false);
    expect(isRoleAllowed(undefined as any)).toBe(false);
  });

  it("createRoleService - returns created role on success", async () => {
    const fakeRole = { id: "x", name: "something" };
    jest.spyOn(repo, "createRole").mockResolvedValueOnce(fakeRole as any);

    const res = await createRoleService("something");

    expect(repo.createRole).toHaveBeenCalledWith("something");
    expect(res).toEqual({ ok: true, status: 201, data: fakeRole });
  });

  it("createRoleService - returns error when repository throws", async () => {
    jest.spyOn(repo, "createRole").mockImplementationOnce(() => {
      throw new Error("db boom");
    });

    const res = await createRoleService("something");

    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.error).toBeDefined();
  });

  it("getRolesService - returns roles on success", async () => {
    const roles = [{ id: "1", name: "r1" }];
    jest.spyOn(repo, "getAllRoles").mockResolvedValueOnce(roles as any);

    const res = await getRolesService();

    expect(repo.getAllRoles).toHaveBeenCalled();
    expect(res).toEqual({ ok: true, status: 200, data: roles });
  });

  it("getRolesService - returns error when repository throws", async () => {
    jest.spyOn(repo, "getAllRoles").mockImplementationOnce(() => {
      throw new Error("boom");
    });

    const res = await getRolesService();

    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.error).toBeDefined();
  });

  it("getRoleByIdService - returns role on success", async () => {
    const role = { id: "1", name: "admin" };
    jest.spyOn(repo, "getRoleById").mockResolvedValueOnce(role as any);

    const res = await getRoleByIdService("1");

    expect(repo.getRoleById).toHaveBeenCalledWith("1");
    expect(res).toEqual({ ok: true, status: 200, data: role });
  });

  it("getRoleByIdService - returns error when repository throws", async () => {
    jest.spyOn(repo, "getRoleById").mockImplementationOnce(() => {
      throw new Error("boom");
    });

    const res = await getRoleByIdService("1");

    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.error).toBeDefined();
  });
});
