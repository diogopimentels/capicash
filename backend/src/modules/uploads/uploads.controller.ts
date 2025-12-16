import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('uploads')
@UseGuards(ClerkAuthGuard)
export class UploadsController {
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            dest: './public/uploads',
            fileFilter: (req: any, file: any, callback: any) => {
                // Aceitar apenas imagens
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(
                        new BadRequestException('Apenas imagens são permitidas (jpg, jpeg, png, gif, webp)'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    uploadImage(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        // Retorna a URL pública do arquivo
        const imageUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${file.filename}`;

        return {
            success: true,
            imageUrl,
            filename: file.filename,
            size: file.size,
        };
    }
}
