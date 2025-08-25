import type { Model, Dataset, Space, ResourceDetails, ResourceType } from "@/types/huggingface";

const HF_API_BASE_URL = "https://huggingface.co/api";

type GetResourcesParams = {
  search?: string;
  author?: string;
  sort?: "downloads" | "likes" | "updated";
  limit?: number;
  direction?: "-1";
};

async function fetchFromApi<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const url = new URL(endpoint, HF_API_BASE_URL);
  
  Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .forEach(([key, value]) => url.searchParams.append(key, String(value)));

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    // Log the response to get more details on the error
    const errorBody = await response.text();
    console.error(`API Error Response: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return response.json();
}

export async function getModels(params: GetResourcesParams): Promise<Model[]> {
  return fetchFromApi<Model[]>('/models', params);
}

export async function getDatasets(params: GetResourcesParams): Promise<Dataset[]> {
  return fetchFromApi<Dataset[]>('/datasets', params);
}

export async function getSpaces(params: GetResourcesParams): Promise<Space[]> {
  return fetchFromApi<Space[]>('/spaces', params);
}

export async function getResourceDetails(type: ResourceType, id: string): Promise<ResourceDetails> {
  const details = await fetchFromApi<ResourceDetails>(`/${type}s/${id}`);

  try {
    const readmeUrl = `https://huggingface.co/${id}/raw/main/README.md`;
    const readmeResponse = await fetch(readmeUrl, { next: { revalidate: 3600 } });
    if (readmeResponse.ok) {
      details.readme = await readmeResponse.text();
    }
  } catch (error) {
    console.warn(`Could not fetch README for ${id}:`, error);
    details.readme = "README file not found or could not be loaded."
  }
  
  // Extract license from tags if available
  const licenseTag = details.tags.find(tag => tag.startsWith('license:'));
  if (licenseTag) {
    details.license = licenseTag.split(':')[1];
  }

  return details;
}
