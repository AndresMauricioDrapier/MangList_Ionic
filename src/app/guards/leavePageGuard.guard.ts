import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate: () =>
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}

export const leavePageGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
