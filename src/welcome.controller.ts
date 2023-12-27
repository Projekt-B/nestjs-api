import { Controller, Get } from '@nestjs/common';

@Controller({
    path: '/',
})
export class WelcomeController {
    @Get()
    index() {
        return `Hello world`;
    }
}
