import { Navigate } from "react-router-dom";
import { ApplyForm } from "../../components/apply/ApplyForm";
import { auth } from "../../lib/auth";
import { loadDocumentsSession } from "../../lib/documentsSession";

// The front door of the merged app, reachable without signing in.
//
// - A person who submitted on this device but hasn't finished their documents goes straight back
//   to the documents step (behind the login wall, if they haven't signed in yet).
// - Everyone else gets the application form, with their existing applications listed on step 1.
//
// The standalone Apply app at easybuy-frontend-bbox.vercel.app keeps serving the same job during
// the migration, so old links and in-flight drafts there are untouched.

export const ApplyPage = () => {
  const session = loadDocumentsSession();

  // A finished application's session is left in storage (it records the claim), so it must not
  // count as unfinished — otherwise "Apply for another device" would bounce straight back here.
  if (session && !session.complete && auth.isLoggedIn()) {
    return <Navigate to="/apply/documents" replace />;
  }

  return <ApplyForm />;
};
