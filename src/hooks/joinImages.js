import React, { useEffect, useState } from "react"

export default function useJoinImages() {
  const [loadedImagesCounter, setLoadedImagesCounter] = useState(0)
  const [imagesLength, setImagesLength] = useState(null)
  const [resultImage, setResultImage] = useState(null)

  useEffect(() => {
    // drawing images on canvas just when all images was loaded
    if (loadedImagesCounter === imagesLength) {
      renderImagesOnCanvas()
    }
  }, [loadedImagesCounter])

  const joinImages = (images) => {
    // init canvas and image container for joining images
    const rootDiv = document.getElementById("root")
    const wrapperDiv = document.createElement("div")
    wrapperDiv.id = "uji-wrapper"
    wrapperDiv.style.display = "none"
    const imagesContainer = document.createElement("div")
    imagesContainer.id = "uji-images-container"
    const canvas = document.createElement("canvas")
    canvas.id = "uji-canvas"

    rootDiv.appendChild(wrapperDiv)
    wrapperDiv.appendChild(imagesContainer)
    wrapperDiv.appendChild(canvas)

    setImagesLength(images.length)
    renderImages(images)
  }
  const renderImages = (images) => {
    const imagesContainer = document.getElementById("uji-images-container")
    images.forEach((image, index) => {
      const img = new Image()
      img.src = image
      img.onload = function() {
        setLoadedImagesCounter(prevLoadedImagesCounter => prevLoadedImagesCounter + 1)
      }
      img.crossOrigin = 'anonymous'
      img.id = "image" + index

      imagesContainer.appendChild(img)
    })
  }

  const renderImagesOnCanvas = () => {
    const imageNodes = document.getElementById("uji-images-container")
      .childNodes
    const canvas = document.getElementById("uji-canvas")
    const ctx = canvas.getContext("2d")
    let prevImageHeight = 0
    canvas.height = 0
    imageNodes.forEach((node) => {
      canvas.height += node.height
      if (canvas.width < node.width) canvas.width = node.width
    })
    imageNodes.forEach((node) => {
      ctx.drawImage(node, 0, prevImageHeight)
      prevImageHeight += node.height
    })

    getStitchedImage()
  }

  const getStitchedImage = () => {
    const canvas = document.getElementById("uji-canvas")
    const image = canvas.toDataURL()
    setResultImage(image)
    removeSupportingElements()
  }

  const removeSupportingElements = () => {
    const rootDiv = document.getElementById('root')
    const wrapperElement = document.getElementById('uji-wrapper')
    rootDiv.removeChild(wrapperElement)
  }

  return [resultImage, joinImages]
}
