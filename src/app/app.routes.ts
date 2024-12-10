import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { hasAccessGuard } from './core/auth/guards/hasAccess.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'example' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadComponent: () => import('app/modules/auth/confirmation-required/confirmation-required.component').then((m) => m.AuthConfirmationRequiredComponent), },
            { path: 'forgot-password', loadComponent: () => import('app/modules/auth/forgot-password/forgot-password.component').then((m) => m.AuthForgotPasswordComponent), },
            { path: 'reset-password', loadComponent: () => import('app/modules/auth/reset-password/reset-password.component').then((m) => m.AuthResetPasswordComponent), },
            { path: 'sign-in', loadComponent: () => import('app/modules/auth/sign-in/sign-in.component').then((m) => m.AuthSignInComponent), },
            { path: 'sign-up', loadComponent: () => import('app/modules/auth/sign-up/sign-up.component').then((m) => m.AuthSignUpComponent), }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadComponent: () => import('app/modules/auth/sign-out/sign-out.component').then((m) => m.AuthSignOutComponent), },
            { path: 'unlock-session', loadComponent: () => import('app/modules/auth/unlock-session/unlock-session.component').then((m) => m.AuthUnlockSessionComponent), }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadComponent: () => import('app/modules/landing/home/home.component').then((m) => m.LandingHomeComponent), }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'example', loadComponent: () => import('app/modules/admin/example/example.component').then((m) => m.ExampleComponent), }
        ]
    },

    { //// works
        path: 'home2', loadComponent: () =>
            import('app/modules/landing/home/home.component')
                .then((m) => m.LandingHomeComponent),
        canActivate: [hasAccessGuard],
        data: {
            roles: ['Admin'],
            claims: ['CanManageUsers', 'CanViewAdminDashboard'],
        },
    },


    // Error
    { path: '404-not-found', pathMatch: 'full', loadComponent: () => import('app/core/error/error-404/error-404.component').then((m) => m.Error404Component) },
    { path: '500-server-error', pathMatch: 'full', loadComponent: () => import('app/core/error/error-500/error-500.component').then((m) => m.Error500Component) },
    { path: '**', redirectTo: '404-not-found' }
];







/*

 //bsharah notes 2024-11-25 // how to use lazy load , roles and calims

  {
        path: 'page1',
        loadComponent: () =>
            import('./pages/components/page1/page1.component').then((m) => m.Page1Component),
        canActivate: [hasAccessGuard],
        data: {
            roles: ['Admin'],
            claims: ['CanManageUsers', 'CanViewAdminDashboard'],
        },
    },

    {
        path: 'home',
        // loadComponent: () =>
        //     import('./core/components/home/home.component').then((m) => m.HomeComponent),
        // loadComponent: () => {
        //     console.log('Loading HomeComponent...');
        //     return import('./core/components/home/home.component').then((m) => m.HomeComponent);
        //   },
        loadComponent: async () => {
            console.log('Loading HomeComponent...');
            const m = await import('./core/components/home/home.component');
            return m.HomeComponent;
        },
    },
    


*/