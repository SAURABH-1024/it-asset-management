// import { AuthorizationMetadata, AuthorizationDecision, Authorizer, AuthorizationContext } from '@loopback/authorization';
// import { UserProfile } from '@loopback/security'; // Import UserProfile
// import { injectable, inject } from '@loopback/core';
// import { AuthenticationBindings } from '@loopback/authentication';

// @injectable()
// export class CustomAuthorizer implements Authorizer {
//     constructor(
//         @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile | undefined, // Allow for undefined current user
//     ) { }

//     // Correct method signature for the Authorizer interface
//     async authorize(
//         context: AuthorizationContext, // AuthorizationContext parameter
//         authorizationMetadata: AuthorizationMetadata, // AuthorizationMetadata parameter
//     ): Promise<AuthorizationDecision> {
//         // Check if the currentUser  is defined
//         if (!this.currentUser || !this.currentUser.role) {
//             return AuthorizationDecision.DENY; // User is not authenticated or role is not defined
//         }

//         // Retrieve allowed roles from metadata
//         const allowedRoles = authorizationMetadata.allowedRoles;

//         // If no roles are specified, deny access by default
//         if (!allowedRoles || allowedRoles.length === 0) {
//             return AuthorizationDecision.DENY;
//         }

//         // Check if the current user's role is in the list of allowed roles
//         if (allowedRoles.includes(this.currentUser.role)) {
//             return AuthorizationDecision.ALLOW; // User is authorized
//         }

//         return AuthorizationDecision.DENY; // User does not have permission
//     }
// }
