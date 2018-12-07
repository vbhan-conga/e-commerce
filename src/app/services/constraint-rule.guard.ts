import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConstraintRuleService } from '@apttus/constraint-rules';

@Injectable()
export class ConstraintRuleGuard implements CanActivate {

    constructor(private router: Router, private crService: ConstraintRuleService) { 
        this.crService.hasPendingErrors().subscribe(hasErrors => {
            if(hasErrors && this.router.url === '/cart')
                this.router.navigate(['/manage-cart']);
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.crService.hasPendingErrors().map(res => !res);
    }

}