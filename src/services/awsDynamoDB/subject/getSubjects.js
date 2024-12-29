import { API, graphqlOperation } from "aws-amplify";
import { listSubjects } from "../../../graphql/queries";

const getSubjects = async () => {
  try {
    const result = await API.graphql(
      graphqlOperation(listSubjects, {
        filter: {
          enable: {
            eq: true,
          },
        },
      }),
    );
    return result.data.listSubjects.items;
  } catch (error) {
    console.error("getSubjects error:　", error);
    return [];
  }
};

export default getSubjects;
