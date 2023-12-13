/**
 * iframeCanvas
 */
import { useEffect, useRef } from 'react'
import { useEngine } from './useEngine'
import { LC_ENGINE } from '../common/constants'
import { useMaterialAssetsData } from './useMaterialAssetsData'

export function useIframeCanvas() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { engine } = useEngine()
  const { assetsData } = useMaterialAssetsData()

  useEffect(() => {
    const contentDocument = iframeRef.current?.contentDocument
    const contentWindow = iframeRef.current?.contentWindow
    if (contentDocument && contentWindow && engine && assetsData) {
      contentWindow[LC_ENGINE] = engine
      contentDocument.open()
      contentDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>SimulatorRender</title>
          ${assetsData.editCssList
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
          ${assetsData.editJsList
          .map(
            (js) => `
          <script src="${js}"></script>
          `,
          )
          .join('\n')}
          <script type="module" src="${engine.config.simulatorUrl}"></script>
        </body>
      </html>
      `)
      contentDocument.close()
    }
  }, [engine, assetsData])

  const onLoad = () => {
    const contentWindow = iframeRef.current?.contentWindow
    const contentDocument = iframeRef.current?.contentDocument
    if (contentWindow && contentDocument && engine) {
      engine.shell.createIframeCanvas(iframeRef.current)
    }
  }

  return { iframeRef, onLoad }
}
