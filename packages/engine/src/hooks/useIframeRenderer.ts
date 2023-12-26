/**
 * iframeCanvas
 */
import { useEffect, useRef } from 'react'
import { useEngine } from './useEngine'
import { useMaterialAssetsData } from './useMaterialAssetsData'
import { RENDERER_URL, LC_ASSETS_URL, ASSETS_URL } from '../common/constants'

export function useIframeRenderer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { engine } = useEngine()
  const { assetsData } = useMaterialAssetsData()

  useEffect(() => {
    const contentDocument = iframeRef.current?.contentDocument
    const contentWindow = iframeRef.current?.contentWindow
    if (contentDocument && contentWindow && engine && assetsData) {
      contentWindow[LC_ASSETS_URL] = engine.config.get(ASSETS_URL) as string
      contentDocument.open()
      contentDocument.write(`
      <!DOCTYPE html>
      <html lang="zh">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Renderer</title>
          ${assetsData.cssList
            .map(
              (css) => `
          <link rel="stylesheet" href="${css}" />
          `,
            )
            .join('\n')}
          </script>
        </head>
        <body>
          <div id="root"></div>
          ${assetsData.jsList
            .map(
              (js) => `
          <script src="${js}"></script>
          `,
            )
            .join('\n')}
          <script type="module" src="${engine.config.get(
            RENDERER_URL,
          )}"></script>
        </body>
      </html>
      `)
      contentDocument.close()
    }
  }, [engine, assetsData])

  const onLoad = () => {
    console.log('renderer loaded')
  }

  return { iframeRef, onLoad }
}
