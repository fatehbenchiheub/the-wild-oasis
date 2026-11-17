type EmptyProp = {
  resourceName: string;
};

function Empty({ resourceName }: EmptyProp) {
  return <p>No {resourceName} could be found.</p>;
}

export default Empty;
