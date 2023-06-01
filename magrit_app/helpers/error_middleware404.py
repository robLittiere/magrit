from aiohttp import web


async def handle_404(request, response):
    return web.FileResponse('./static/page404.html')

async def error_middleware(app, handler):

    @web.middleware
    async def middleware_handler(request):
        try:
            response = await handler(request)
            if response.status == 404:
                return await handle_404(request, response)
            return response
        except web.HTTPException as ex:
            if ex.status == 404:
                return await handle_404(request, ex)
            raise

    return middleware_handler
