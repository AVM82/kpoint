export type TestRequest = {
    file: File | string,
    createdProject:{ title:string, 
      url:string, summary:string,
       description:string, tags:string[],
        goalDeadline:string, collectDeadline:string,
         networksLinks:{ FACEBOOK: string }
    }
  };