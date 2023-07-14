
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateRequest = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            status: { code: 400, success: false },
            tag: 'VALIDATION_ERROR',
            data: [],
            message: 'Request body validation failed.',
            errors: errors.array(),
        });
    };
};

export {
    validateRequest
}