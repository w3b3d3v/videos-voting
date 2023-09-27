export async function fetchProjectData(
    organization: string,
    projectNumber: number,
    token: any
  ) {
    const query = `
      query {
        organization(login: "${organization}") {
          projectV2(number: ${projectNumber}) {
            id
            items(first: 20) {
              nodes {
                id
                fieldValues(first: 20) {
                  nodes {
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                  }
                }
                content {
                  ... on DraftIssue {
                    title
                    body
                  }
                  ... on Issue {
                    title
                    assignees(first: 10) {
                      nodes {
                        login
                      }
                    }
                  }
                  ... on PullRequest {
                    title
                    assignees(first: 10) {
                      nodes {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch data from GitHub API");
    }
  
    return response.json();
  }
  