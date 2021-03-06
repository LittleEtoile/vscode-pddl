/* --------------------------------------------------------------------------------------------
 * Copyright (c) Jan Dolejsi. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { Plan } from './plan';

export enum PlanningOutcome { SUCCESS, FAILURE, KILLED }

/**
 * Outcome of the planner execution.
 */
export class PlanningResult {
    constructor(public outcome: PlanningOutcome, public plans: Plan[], public elapsedTime: number, public error: string) { }

    /**
     * Creates the result instance for the case of successful planner execution.
     * @param plans plans
     */
    static success(plans: Plan[], elapsedTime: number): PlanningResult{
        return new PlanningResult(PlanningOutcome.SUCCESS, plans, elapsedTime, null);
    }

    /**
     * Creates the result instance for the case of planner failure.
     * @param error error
     */
    static failure(error: string){
        return new PlanningResult(PlanningOutcome.FAILURE, [], Number.NaN, error);
    }

    /**
     * Creates the result instance for the case of planner killed by the user.
     */
    static killed(){
        return new PlanningResult(PlanningOutcome.KILLED, [], Number.NaN, null);
    }
}