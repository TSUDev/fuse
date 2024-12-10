import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const hasAccessGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  var router = inject(Router);

  console.log("debug here ")
  if (!service.isLoggedIn()) {
    router.navigate(['/sign-in']);
    return false;
  }

  // Get the required roles and claims from the route data
  const requiredRoles = route.data['roles'] as string[];
  const requiredClaims = route.data['claims'] as string[];

  console.log("userService.user$.subscribe(user => {")

  service.user$.subscribe(user => {
    console.log(user);
    console.log("1")
    // No user means no access
    if (!user) {
      console.log("2")
      router.navigate(['/sign-in']);
      return false;
    }
    console.log("3")
    // Check roles if any are required
    const hasRoleAccess = !requiredRoles || requiredRoles.length === 0 || (user.roles && requiredRoles.some(role => user.roles?.includes(role)));
    console.log("hasRoleAccess")
    console.log(hasRoleAccess)
    // Check claims if any are required
    const hasClaimAccess = !requiredClaims || requiredClaims.length === 0 || (user.claims && requiredClaims.every(claim => user.claims?.includes(claim)));

    console.log("hasClaimAccess")
    console.log(hasClaimAccess)
    // User has access only if both roles and claims conditions are met
    if (hasRoleAccess && hasClaimAccess) {
      return true;
    } else {
      router.navigate(['/404-not-found']);
      return false;
    }

  });

  

};



/*
//usage ex:

{
  path: 'admin',
  component: AdminComponent,
  canActivate: [hasAccessGuard],
  data: { 
    roles: ['Admin'], 
    claims: ['CanManageUsers', 'CanViewAdminDashboard']
  }
},
{
  path: 'editor',
  component: EditorComponent,
  canActivate: [hasAccessGuard],
  data: { 
    roles: ['Admin', 'Editor'], 
    claims: ['CanEditContent']
  }
}


*/