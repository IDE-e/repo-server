export class OpenIssuesDto {
  total!: number;
  critical!: number;
  major!: number;
  minor!: number;
}

export class BuildDto {
  status!: string; // e.g. "Passing"
  lastRunLabel!: string; // e.g. "#184 · 2 min ago"
}

export class SummaryDto {
  activeBranch!: string;
  lastDeploy!: string; // display string
  openIssues!: OpenIssuesDto;
  build!: BuildDto;
}

export class TaskItemDto {
  id!: string;
  done!: boolean;
  title!: string;
  meta!: string;
  accent?: string; // e.g. "point" | "danger"
}

export class TasksDto {
  completed!: number;
  total!: number;
  items!: TaskItemDto[];
}

export class CommitItemDto {
  hash!: string;
  message!: string;
  time!: string; // display string
}

export class EnvironmentDto {
  runtime!: string[];
  ui!: string[];
  charts!: string[];
}

export class DashboardDataDto {
  summary!: SummaryDto;
  tasks!: TasksDto;
  activity!: CommitItemDto[];
  environment!: EnvironmentDto;
}
