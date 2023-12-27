import { Controller, All } from '@nestjs/common';

@Controller({
    path: '/',
})
export class WelcomeController {
    @All()
    index() {
        return `Hello world`;
    }
}
