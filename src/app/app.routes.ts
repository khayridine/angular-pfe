import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PortfeuilleComponent } from './pages/portfeuille/portfeuille.component';
import { ActionsComponent } from './pages/actions/actions.component';
import { FormulaireComponent } from './pages/calculateur/formulaire.component'
import {  PortefeuilleOptimisationComponent } from './pages/optimisation/optimisation.component';

import { CreatePortefeuilleComponent } from './pages/create-portefeuille/create-portefeuille.component'
import { ComparerPortefeuillesComponent } from './pages/comparer-portefeuilles/comparer-portefeuilles.component';
export const routes: Routes = [
    {path:"", component:LoginComponent,},
    {path:"signup", component:SignupComponent},
    {path:"home",  component:HomeComponent},
    {path:"profile", component:ProfileComponent},
    { path: 'portfeuille', component:PortfeuilleComponent},
    { path: 'actions', component: ActionsComponent },
    { path: 'formulaire', component: FormulaireComponent},
     { path: 'optimisation', component: PortefeuilleOptimisationComponent },
    { path: 'create-portefeuille', component: CreatePortefeuilleComponent },
    {path: 'comparer-portefeuilles',component: ComparerPortefeuillesComponent},


   

    {path:"**",  redirectTo:''},


];
