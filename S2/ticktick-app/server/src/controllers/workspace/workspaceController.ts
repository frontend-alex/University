import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../../services/workspace/workspaceService";
import { IUser } from "../../models/user";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();

  public onboardUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceName, workspaceTypes } = req.body;
      const user = req.user as IUser;

      const workspace = await this.workspaceService.onboardUser(
        user,
        workspaceName,
        workspaceTypes
      );

      res.status(201).json({
        message: "Onboarding completed successfully",
        workspace,
      });
    } catch (err) {
      next(err);
    }
  };

  public getWorkspaceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await this.workspaceService.getWorkspaceById(
        workspaceId
      );

      res.status(200).json({
        success: true,
        data: workspace,
      });
    } catch (err) {
      next(err);
    }
  };

  public inviteUsersToWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.workspaceId;
      const { emailToInvite, sender } = req.body;

      const result = await this.workspaceService.inviteUsersToWorkspace(
        workspaceId,
        emailToInvite,
        sender
      );

      res.status(200).json({
        success: true,
        message: "Users invited successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  public acceptWorkspaceInvite = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as IUser).id;

      const result = await this.workspaceService.acceptWorkspaceInvite(
        workspaceId,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Workspace invitation accepted successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  public leaveWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { workspaceId } = req.params;
    const userId = (req.user as IUser).id;

    try {
      const response = await this.workspaceService.leaveWorkspace(
        workspaceId,
        userId
      );

      res.status(200).json({
        message: "You have successfully left the workspace!",
        success: false,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };
}
