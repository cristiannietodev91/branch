import React, { useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { Image, Overlay } from "@rneui/themed";
import GallerySwiper from "react-native-gallery-swiper";

export default function GalleryList(props: any) {
  const { images, itemsToRender } = props;
  const [visible, setVisible] = useState(false);
  const [initialPage, setInitialPage] = useState(0);

  const loadGallery = (index: number) => {
    setInitialPage(index);
    setVisible(!visible);
  };

  const itemsToShow = !itemsToRender ? 1 : itemsToRender;
  console.log("Items to show ::>", itemsToShow);

  return (
    <View>
      <FlatList
        horizontal={false}
        data={images.slice(0, itemsToShow)}
        renderItem={(photo) => (
          <Photo
            image={photo.item}
            loadGallery={loadGallery}
            initialPage={initialPage}
            index={photo.index}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      <OverlayGallery
        photos={images}
        visible={visible}
        toggleOverlay={loadGallery}
        initialPage={initialPage}
      />
    </View>
  );
}

const Photo = (props: any) => {
  const { image, loadGallery, index } = props;

  return (
    <TouchableOpacity
      onPress={() => {
        loadGallery(index);
      }}
    >
      <Image
        source={{ uri: image.thumbnail }}
        style={{
          width: 150,
          height: 150,
          borderColor: "#deece9",
          borderWidth: 2,
        }}
        PlaceholderContent={<ActivityIndicator />}
      />
    </TouchableOpacity>
  );
};

const OverlayGallery = (props: any) => {
  const { visible, toggleOverlay, photos, initialPage } = props;
  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <GallerySwiper images={photos} initialPage={initialPage} />
    </Overlay>
  );
};
