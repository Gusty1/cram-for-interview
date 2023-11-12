import Colors from "./Colors"

/*
  一些通用的樣式
 */

export default {
  myHeaderStyle: {
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTintColor: Colors.headerColor,
    headerTitleAlign: 'center',
    headerMarginRight: 16,
  },
  defaultShadow: {
    elevation: 10,
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowRadius: 10,
    // shadowOpacity: 0.5,
  },
  defaultBorder: {
    borderRadius: 10,
    borderColor: Colors.borderColor,
    borderWidth: 1.5,
  },
  defaultMainContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  }
}