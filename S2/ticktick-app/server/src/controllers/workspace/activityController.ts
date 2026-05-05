import { NextFunction, Request, Response } from "express";
import { ActivityRepository } from "../../repositories/workspace/activityRepository";

export class ActivityController {
  private activityRepository = new ActivityRepository();

  public async getWorkspaceActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { workspaceId } = req.params;

    try {
      const logs = await this.activityRepository.getActivitiesByWorkspace(
        workspaceId
      );
      
      res.status(200).json({
        success: true,
        message: "Succsessfully fetched data!",
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}
