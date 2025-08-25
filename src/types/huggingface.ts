export type ResourceType = "models" | "datasets" | "spaces";

interface BaseResource {
  _id: string;
  id: string;
  author: string;
  lastModified: string;
  private: boolean;
  sha: string;
  tags: string[];
  downloads?: number;
  likes?: number;
  library_name?: string;
}

export interface Model extends BaseResource {
  pipeline_tag?: string;
  modelId?: string; // Sometimes id is modelId
}

export interface Dataset extends BaseResource {
  gated: boolean;
}

export interface Space extends BaseResource {
  sdk?: "streamlit" | "gradio" | "docker" | "static";
  appState?: "running" | "sleeping" | "stopped" | "building" | "error";
}

export interface ResourceDetails extends Model, Dataset, Space {
  readme?: string;
  siblings?: { rfilename: string }[];
  license?: string;
}
