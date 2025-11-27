import {
  createRoleController,
  getRolesController,
  getRoleByIdController,
} from "../../../src/controllers/roles.controller";
import {
  createRoleService,
  getRolesService,
  getRoleByIdService,
} from "../../../src/services/roles.service";

jest.mock("../../../src/services/roles.service");

describe("roles.controller - Unit tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {}, params: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("createRoleController - returns 201 and created role on success", async () => {
    const fakeRole = { id: "abc", name: "admin" };
    (createRoleService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      data: fakeRole,
    });

    req.body = { name: "admin" };

    await createRoleController(req, res);

    expect(createRoleService).toHaveBeenCalledWith("admin");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeRole);
  });

  it("createRoleController - returns service error status and message", async () => {
    (createRoleService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      error: "Some error",
    });

    req.body = { name: "admin" };

    await createRoleController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Some error" });
  });

  it("createRoleController - returns 500 on unexpected exception", async () => {
    (createRoleService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    req.body = { name: "admin" };

    await createRoleController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("getRolesController - returns 200 and roles on success", async () => {
    const roles = [
      { id: "1", name: "admin" },
      { id: "2", name: "personal" },
    ];
    (getRolesService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: roles,
    });

    await getRolesController(req, res);

    expect(getRolesService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roles);
  });

  it("getRolesController - returns service error status and message", async () => {
    (getRolesService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      error: "DB error",
    });

    await getRolesController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
  });

  it("getRolesController - returns 500 on unexpected exception", async () => {
    (getRolesService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    await getRolesController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("getRoleByIdController - returns 200 and role on success", async () => {
    const role = { id: "1", name: "admin" };
    (getRoleByIdService as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: role,
    });

    req.params = { roleId: "1" };

    await getRoleByIdController(req, res);

    expect(getRoleByIdService).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(role);
  });

  it("getRoleByIdController - returns 400 when roleId is missing", async () => {
    req.params = {};

    await getRoleByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Role ID is required" });
  });

  it("getRoleByIdController - returns service error status and message", async () => {
    (getRoleByIdService as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      error: "Not found",
    });

    req.params = { roleId: "nope" };

    await getRoleByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("getRoleByIdController - returns 500 on unexpected exception", async () => {
    (getRoleByIdService as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    req.params = { roleId: "1" };

    await getRoleByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
